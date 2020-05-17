var rfr = require("rfr")
var forwarderService = rfr("node_modules/aws-cloudwatch-forwarder/lib/forwarderService")
var awsForwarderService = rfr("node_modules/aws-cloudwatch-forwarder/lib/awsForwarderService")
var stdOutForwarderService = rfr("node_modules/aws-cloudwatch-forwarder/lib/stdOutForwarderService")
var cloudWatchLogsFactory = rfr("node_modules/aws-cloudwatch-forwarder/lib/cloudWatchLogsFactory")

module.exports = () => {
    return {
        create: () => {
            var cloudWatchLogs = cloudWatchLogsFactory().create()
            var awsForwarder = awsForwarderService(cloudWatchLogs)

            var stdOutForwarder = stdOutForwarderService()

            var result = forwarderService([
                awsForwarder,
                stdOutForwarder
            ])

            return result
        }
    }
}