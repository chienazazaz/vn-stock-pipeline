import { BigQuery } from "@google-cloud/bigquery";
import { adapt, managedwriter } from "@google-cloud/bigquery-storage";

const client = new BigQuery();
const DATASET = process.env.DATASET || "FireAnt";
const PROJECT_ID = process.env.PROJECT_ID || "FireAnt";

const { WriterClient, JSONWriter } = managedwriter;
const writeClient = new WriterClient();

const getTableSchema = async (table: string) => {
  const [metadata] = await client.dataset(DATASET).table(table).getMetadata();
  return metadata.schema;
};

export const checkTable = async (options: CreateLoadStreamOptions) => {
  const result = await client
    .dataset(DATASET)
    .table(options.table)
    .get()
    .then(() => "table existed")
    .catch(
      async () =>
        await client
          .dataset(DATASET)
          .createTable(options.table, {
            schema: options.schema,
            location: "US",
          })
          .then(([table]) => {
            console.log(table.id);
            return table.id;
          })
    );
  return result;
};

export const createStorageWriteStream = async (
  options: CreateLoadStreamOptions,
  rows: any[]
) => {
  try {
    await checkTable(options);
    const schema = await getTableSchema(options.table);
    const streamId = await writeClient.createWriteStream({
      streamType: managedwriter.PendingStream,
      destinationTable: `projects/${PROJECT_ID}/datasets/${DATASET}/tables/${options.table}`,
    });
    const connection = await writeClient.createStreamConnection({
      streamId,
    });
    const protoDescriptor = adapt.convertStorageSchemaToProto2Descriptor(
      adapt.convertBigQuerySchemaToStorageTableSchema(schema),
      options.table
    );

    const writer = new JSONWriter({
      connection,
      protoDescriptor,
    });
    // console.log(rows[0])
    const results = await Promise.all(
      [writer.appendRows(rows, 0)].map((pw) => pw.getResult())
    );
    const rowCount = await connection.finalize();
    const response = await writeClient.batchCommitWriteStream({
      parent: `projects/${PROJECT_ID}/datasets/${DATASET}/tables/${options.table}`,
      writeStreams: [streamId],
    });
    return {
      response,
      ...rowCount,
      rowErrors: results[0].rowErrors,
      error: results[0].error,
    };
  } finally {
    writeClient.close();
  }
};

type CreateLoadStreamOptions = {
  table: string;
  schema: Record<string, any>[];
};

export const toString = (obj: any): any => {
  if (obj === null || obj === undefined || obj === "") {
    return (obj = undefined);
  }

  if (typeof obj !== "object") {
    return (obj = "" + obj);
  }

  if (Array.isArray(obj)) {
    return (obj = obj
      .filter((e: any) => e !== null)
      .map((elem: any) => {
        return toString(elem);
      }));
  }

  Object.keys(obj).map((k: string) => (obj[k] = toString(obj[k])));

  return obj;
};
