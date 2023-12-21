import dayjs from 'dayjs'
import express from 'express'
import Joi from 'joi'
import { runPipeline } from './fireant/pipeline.service'

const app = express()
app.use(express.json())


app.use('/:pipeline', async(req,res) => {
    const body = await Joi.object({
        start: Joi.string().default(
            dayjs().subtract(7,'day').format('YYYY-MM-DD')
        ),
        end: Joi.string().default(
            dayjs().format('YYYY-MM-DD')
        )
    }).validateAsync(req.body)

    try {
        const results = runPipeline(req.params.pipeline,body)

        res.status(200).send({results})
    } catch(err) {
        res.status(500).send({err})
    }


})
