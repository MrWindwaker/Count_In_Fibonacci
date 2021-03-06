import exp, { Application } from "express"
import Cors from 'cors'

import Controller from "./Interfaces/Controller"

export default class Server {
    private srv: Application
    private port: number

    constructor(controllers?: Controller[]) {
        this.srv = exp()

        this.port = 3000

        this.config()

        controllers ? this.initializeConrtoller(controllers) : null
    }

    private config() {
        if (process.env.TS_NODE_DEV) {
            this.srv.use(require('morgan')('dev'))
        }

        this.srv.use(exp.static('public'))
        this.srv.use(exp.static('client'))

        this.srv.use(exp.urlencoded({ extended: true }))
        this.srv.use(exp.json())
        this.srv.use(Cors())
    }

    private initializeConrtoller(controllers: Controller[]) {
        controllers.forEach(c => this.srv.use('/', c.router))

        this.srv.get('*', (req, res) => res.sendFile(`${process.env.INIT_CWD}/client/index.html`))
    }

    listen() {
        this.srv.listen(this.port, () => {
            console.log("Server Up On Port:", this.port)
            console.log("Go to http://localhost:3000/ ")
        })
    }
}