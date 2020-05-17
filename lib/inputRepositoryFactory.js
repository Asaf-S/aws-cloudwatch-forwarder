var rfr = require("rfr")
var inputRepositoryModule = rfr("node_modules/aws-cloudwatch-forwarder/lib/inputRepository")

module.exports = (inputRepositoryFn) => {
    if (!inputRepositoryFn){
        inputRepositoryFn = inputRepositoryModule
    }

    return {
        create: childProcessStatus => {
            return inputRepositoryFn(childProcessStatus)
        }
    }
}