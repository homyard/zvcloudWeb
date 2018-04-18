/// <reference path="../../../Scripts/jquery-1.11.1.js" />
(function ($) {
    var rightControls = [
                $('<span title="首页" data-role="page-first">首页</span>'),
                $('<span title="上一页" data-role="page-previous">上一页</span>'),
                $('<span title="下一页" data-role="page-next">下一页</span>'),
                $('<span title="尾页" data-role="page-last">尾页</span>'),
    ],
    leftControls = [
        $('<span>第</span>'),
        $('<span data-role="page-index">0</span>'),
        $('<span>页&nbsp;/&nbsp;共</span>'),
        $('<span data-role="page-total">0</span>'),
        $('<span>页，共</span>'),
        $('<span data-role="record-total">0</span>'),
        $('<span>条数据</span>')
    ];
    
    var clone = function (source) {
        var target = [];
        $.each(source, function () {
            target.push(this);
        });
        return target;
    };
    var init = function ($target) {
        var $control = $(".pager-control", $target);
        var data = $target.data('pagination'), opts = data.options;

        if ($control.length == 0) {
            var $pagerPanel, $leftPanel, $rightPanel;
            $pagerPanel = $('<div />').addClass("pager-control"),
            $leftPanel = $('<div />').addClass("pager-info"),
            $rightPanel = $('<div />').addClass("pager-nav");
            $.each(clone(leftControls), function () {
                $leftPanel.append(this);
            });

            $.each(clone(rightControls), function () {
                $rightPanel.append(this);
            });
            $pagerPanel.append($leftPanel).append($rightPanel);

            $target.append($pagerPanel);
        }
        reloadPager($target, opts.totalCount);
    }

    var reloadPager = function ($target, totalCount) {
        var pageIndex, pageSize, totalPage;
        var data = $target.data('pagination'), opts = data.options;
        totalPage = Math.ceil(totalCount / opts.pageSize);

        var controls = $(".pager-control", $target).find('[data-role]');
        for (i = 0; i < controls.length; i++) {
            reloadPagerControl($target, $(controls[i]), opts.pageIndex, totalPage, totalCount);
        }
    }

    var reloadPagerControl = function ($target, $control, pageIndex, totalPage, totalCount) {
        switch ($control.data('role')) {
            case 'page-first':
                if (pageIndex < 2) {
                    $control.addClass("disable").off('click');
                } else {
                    $control.removeClass("disable").off('click').on('click', function () { selectPage($target, 1) });
                }
                break;
            case 'page-previous':
                if (pageIndex < 2) {
                    $control.addClass("disable").off('click');
                } else {
                    $control.removeClass("disable").off('click').on('click', function () {
                        var newPage = (pageIndex && pageIndex > 1) ? pageIndex - 1 : 1;
                        selectPage($target, newPage)
                    });
                }
                break;
            case 'page-next':
                if (totalPage === pageIndex) {
                    $control.addClass("disable").off('click');
                } else {
                    $control.removeClass("disable").off('click').on('click', function () { selectPage($target, pageIndex + 1) });
                }
                break;
            case 'page-last':
                if (totalPage === pageIndex) {
                    $control.addClass("disable").off('click');
                } else {
                    $control.removeClass("disable").off('click').on('click', function () { selectPage($target, totalPage) });
                }
                break;
            case 'page-index':
                $control.text(pageIndex);
                break;
            case 'page-total':
                $control.text(totalPage);
                break;
            case 'record-total':
                $control.text(totalCount);
                break;
        }
    }

    function selectPage($target, pageIndex) {
        var data = $target.data('pagination'), opts = data.options;
        opts.pageIndex = pageIndex;
        opts.onSelectPage.call($target, pageIndex, opts.pageSize);
    };

    $.fn.pagination = function (options, param) {
        if (typeof options == "string") {
            return $.fn.pagination.methods[options](this, param);
        }
        options = options || {};
        return this.each(function () {
            var opts;
            var state = $.data(this, "pagination");
            if (state) {
                opts = $.extend(state.options, options);
            } else {
                opts = $.extend({}, $.fn.pagination.defaults, options);
                $.data(this, "pagination", { options: opts });
            }
            init($(this));
        });
    };

    $.fn.pagination.methods = {
        select: function (jq, pageNumber) {
            return jq.each(function () {
                selectPage(this, pageNumber);
            });
        }
    };

    $.fn.pagination.defaults = {
        totalCount: 1,		//总条数
        pageSize: 10,	//每页显示的条数
        pageIndex: 1,	//当前页码
        onSelectPage: function (pageNumber, pageSize) {

        }
    };
})(jQuery);

