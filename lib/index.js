;(function () {
    var ua = window.navigator.userAgent.toLocaleLowerCase()
    var uatype = {
        android: /android/gi.test(ua),
        ios: /iphone|ipod|ios|ipad/gi.test(ua),
    }

    function slice(arr, start, end) {
        return Array.prototype.slice.call(arr, start, end)
    }

    function getMetaContent(name) {
        var tags = document.getElementsByTagName('meta')

        var content
        var tag
        var els = Array.prototype.slice.call(tags)

        tag = els.find(function (el) {
            return el.getAttribute('name') == name
        })

        tag && (content = tag.getAttribute('content'))

        return content
    }

    function Report() {
        this.init()
    }

    Report.prototype.init = function init() {
        var productid = getMetaContent('lx:productid')
        var typepage = getMetaContent('lx:typepage')
        var autopv = getMetaContent('lx:autopv') !== 'off'
        var bid = getMetaContent('lx:pv')

        this.productid = productid
        this.typepage = typepage
        this.autopv = autopv
        this.bid = bid

        this.autopv && this.PV()
    }

    /**
     * 页面曝光 page view
     */
    Report.prototype.PV = function PV() {
        if (this.isSendPV) {
            return
        }

        this.isSendPV = true
        this.send({
            _type_: 'pv',
            productid: this.productid,
            type_page: this.typepage,
            type: this.bid || 'pv',
        })
    }

    /**
     * 页面曝光 module view
     */
    Report.prototype.MV = function (bid, params = {}) {
        this.send({
            _type_: 'pv',
            productid: this.productid,
            type_page: this.typepage,
            type: bid,
            ...params,
        })
    }

    /**
     * 页面曝光 module click
     */
    Report.prototype.MC = function (bid, params = {}) {
        this.send({
            _type_: 'cl',
            productid: this.productid,
            type_page: this.typepage,
            type: bid,
            ...params,
        })
    }

    Report.prototype.send = function send(params) {
        try {
            const _type_ = params._type_ || 'pv'

            const query = {
                productid: 'appsearch',
                ts: Date.now(),
                os: uatype.ios ? 'ios' : 'android',
                ...params,
            }

            delete query._type_

            const querysearch = []
            for (const key in query) {
                if (Object.prototype.hasOwnProperty.call(query, key)) {
                    querysearch.push(
                        encodeURIComponent(key) +
                            '=' +
                            encodeURIComponent(query[key])
                    )
                }
            }

            const image = new Image()
            if (_type_ == 'pv') {
                image.src = '/pv?' + querysearch.join('&')
            } else {
                image.src = '/cl?' + querysearch.join('&')
            }
        } catch (err) {
            console.error(err)
        }
    }

    var globalReportInstance = null

    function main(type) {
        var rest
        var args = []
        var len = arguments.length

        while (len--) args[len] = arguments[len]

        if (args.length) {
            rest = slice(args, 1, args.length)

            try {
                if (globalReportInstance) {
                    execute(globalReportInstance, type, rest)
                } else {
                    init(function (report) {
                        // 全局 mounted
                        window.__fr_report = report
                        globalReportInstance = report

                        execute(globalReportInstance, type, rest)
                    })
                }
            } catch (err) {}
        }
    }

    function execute(report, type, params) {
        if (typeof report[type] === 'function') {
            return report[type].apply(report, params)
        }
    }

    function init(callback) {
        var report = new Report()

        callback && callback(report)
    }

    var namespace = '_ReportALogObject'
    function createReport() {
        const name = window[namespace]

        return window[name]
    }

    // ready
    if (!window.reportReady) {
        window.reportReady = true

        var initialized = true
        var isFlushQueue = false

        var queue
        queue = (function () {
            var lx = createReport()
            if (lx) {
                lx.q.push = function push(argv) {
                    // 存储后执行上报操作
                    main.apply(null, argv)
                }
            }

            const q = lx && lx.q && Array.isArray(lx.q) ? lx.q : []

            return q
        })()

        function flush(q) {
            if (!isFlushQueue) {
                if (q) {
                    q.forEach(function (argv) {
                        var args = []
                        var len = argv.length

                        while (len--) args[len] = argv[len]

                        var type = args && args[0]

                        if (type) {
                            main.apply(null, args)
                        }
                    })

                    main(function () {
                        // ignore
                    })

                    isFlushQueue = true
                }
            }
        }

        if (queue.length == 0) {
            init(function (report) {
                globalReportInstance = report
            })
        } else {
            initialized && flush(queue)
        }
    }
})()
