import dayjs from "dayjs"
import { createStorageWriteStream, toString } from "../gcloud/bigquery.service"
import { getData } from "./api.service"
import { PIPELINES, RequestConfig } from "./pipeline.const"

const _batched_at = dayjs().valueOf()*1000

export const runPipeline = async (p:string, param: RequestConfig) => {
    const pipeline = PIPELINES.filter(p_ => p_.name===p)[0]
    const data = await getData(pipeline,param)

    const rows = data.map(r => {
        const {value, error} = pipeline.validationSchema.validate(r)
        if(error) {
            console.log(error)
        }
        return toString({...value, _batched_at})
    })

    return createStorageWriteStream(
        {
            table: `p__${pipeline.name}__${dayjs().format("YYYYMMDD")}`,
            schema: [...pipeline.schema,{name:"_batched_at", type:"TIMESTAMP"}]
        },
        rows
    )

}