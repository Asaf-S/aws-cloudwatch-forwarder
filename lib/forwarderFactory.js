var rfr = require("rfr")
var forwarderModule = rfr("node_modules/aws-cloudwatch-forwarder/lib/forwarder")
var forwarderServiceFactoryModule = rfr("node_modules/aws-cloudwatch-forwarder/lib/forwarderServiceFactory")
var forwarderConfigReaderModule = rfr("node_modules/aws-cloudwatch-forwarder/lib/forwarderConfigReader")

module.exports = (forwarderFn, forwarderServiceFactoryFn, forwarderConfigReaderFn) => {
    if (!forwarderFn){
        forwarderFn = forwarderModule
    }

    if (!forwarderServiceFactoryFn){
        forwarderServiceFactoryFn = forwarderServiceFactoryModule
    }

    if (!forwarderConfigReaderFn){
        forwarderConfigReaderFn = forwarderConfigReaderModule
    }

    return {
        create: inputRepository => {
            return forwarderFn(
                inputRepository,
                forwarderServiceFactoryFn(),
                forwarderConfigReaderFn()
            )
        }
    }
}