var rfr = require("rfr")
var programInitializer = rfr("node_modules/aws-cloudwatch-forwarder/lib/programInitializer")

describe("programInitializer", () => {
    var initializer = null

    var processStub = null
    var applicationExecutorStub = null
    var configReaderStub = null
    var inputRepositoryFactoryStub = null
    var forwarderFactoryStub = null

    beforeEach(() => {
        processStub = {
            argv: []
        }

        applicationExecutorStub = {
            run: () => {}
        }

        configReaderStub = {
            read: () => {}
        }

        inputRepositoryFactoryStub = {
            create: () => {}
        }

        forwarderFactoryStub = {
            create: () => {}
        }

        initializer = programInitializer(
            processStub,
            configReaderStub,
            applicationExecutorStub,
            inputRepositoryFactoryStub,
            forwarderFactoryStub
        )
    })

    function setupApplicationExecutorResult(seededChildProcess) {
        if (!seededChildProcess){
            seededChildProcess = {
                getStatus: () => null
            }
        }

        spyOn(applicationExecutorStub, "run").and.returnValue(seededChildProcess)
    }

    function setupInputRepositoryFactoryResult(seededInputRepository){
        if (!seededInputRepository){
            seededInputRepository = {}
        }

        spyOn(inputRepositoryFactoryStub, "create").and.returnValue(seededInputRepository)
    }

    function setupForwarderFactoryResult(seededForwarder){
        if (!seededForwarder){
            seededForwarder = {}
        }

        spyOn(forwarderFactoryStub, "create").and.returnValue(seededForwarder)
    }

    it ("runs the target application", () => {
        setupApplicationExecutorResult()
        processStub.argv = [
            "node", "aws-forwarder",
            "npm", "run", "test", "--format=json"
        ]

        initializer.init()

        expect(applicationExecutorStub.run).toHaveBeenCalledWith("npm run test --format=json")
    })

    it ("returns the child process of the target application", () => {
        var seededChildProcess = {
            name: "child process",
            getStatus: () => {}
        }
        setupApplicationExecutorResult(seededChildProcess)
        processStub.argv = [
            "node", "aws-forwarder",
            "npm", "start"
        ]

        expect(initializer.init().child).toBe(seededChildProcess)
    })

    it ("returns the configuration", () => {
        var seededConfig = {
            name: "seeded configuration"
        }
        spyOn(configReaderStub, "read").and.returnValue(seededConfig)
        setupApplicationExecutorResult()

        expect(initializer.init().config).toBe(seededConfig)
    })

    it ("creates an inputRepository", () => {
        setupApplicationExecutorResult({
            getStatus: () => "child status"
        })
        setupInputRepositoryFactoryResult()

        initializer.init()

        expect(inputRepositoryFactoryStub.create).toHaveBeenCalledWith("child status")
    })

    it ("creates the forwarder", () => {
        setupApplicationExecutorResult()
        setupInputRepositoryFactoryResult("the input repository")
        setupForwarderFactoryResult()

        initializer.init()

        expect(forwarderFactoryStub.create).toHaveBeenCalledWith("the input repository")
    })

    it ("returns the forwarder", () => {
        setupApplicationExecutorResult()
        setupInputRepositoryFactoryResult()
        setupForwarderFactoryResult("the forwarder")

        expect(initializer.init().forwarder).toBe("the forwarder")
    })
})