### 上报统计

### 种子代码

1. 页面头部

```
<!-- # 埋点统计脚本 - 种子代码 # -->
<meta name="lx:productid" content="{{ page.productid }}"/>
<meta name="lx:typepage" content="{{ page.typepage }}"/>
<meta name="lx:pv" content="{{ page.pv }}"/>

<script type="text/javascript">
  !(function (win, doc, ns) {
    var namespace = '_ReportALogObject';
    win[namespace] = ns;
    if (!win[ns]) {
      var _LX = function () {
            _LX
              .q
              .push(arguments);
            return _LX;
          };

          _LX.q = _LX.q || [];
          _LX.l = + new Date();

          win[ns] = _LX;
        }
      })(window, document, 'Report');
    </script>
```

### 应用

```
 window.Report('MV', 'abc')
```
