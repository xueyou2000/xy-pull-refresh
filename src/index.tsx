import React, { useRef, useEffect, useState, useCallback } from "react";
import classNames from "classnames";
import { PullRefreshProps } from "./interface";
import LoadingSvg from "../assets/loading.svg";
import { useMount } from "utils-hooks";
import "./tools";
import { getScrollPosition } from "./tools";
import Circle from "./Circle";

export enum PullRefreshPosition {
    top,
    middle,
    bottom
}

export enum PullRefreshPositionStatus {
    notEnoughRefreshPort,
    overRefreshPort,
    refreshing
}

export enum PullRefreshLoading {
    none,
    refreshing,
    loadData
}

function RefreshCircle({ percent }) {
    return (
        <div className="xy-pull-refresh-indicator-refreshing">
            <Circle notransition={true} strokeWidth={7} trailWidth={0} percent={percent} trailColor="transparent" />
        </div>
    );
}

const PullRefresh = React.forwardRef((props: PullRefreshProps, refProps: React.MutableRefObject<any>) => {
    const {
        prefixCls = "xy-pull-refresh",
        className,
        style,
        children,
        loading = false,
        isNoMoreData = false,
        enableLoadMore = true,
        enablePullRefresh = false,
        initLock = false,
        threshold = 150,
        onLoadMore,
        onPullRefresh,
        noMoreDataNode = "没有更多数据",
        bottomIndicatorTips = "上滑加载数据",
        notEnoughRefreshNode = (p: number) => <RefreshCircle percent={p} />,
        overRefreshNode = <RefreshCircle percent={100} />,
        onTouchStart: touchStart,
        onTouchMove: touchMove,
        onTouchEnd: touchEnd
    } = props;
    const [pullRefreshStatus, setPullRefreshStatus] = useState<PullRefreshPositionStatus>(PullRefreshPositionStatus.notEnoughRefreshPort);
    const position = useRef<PullRefreshPosition>(PullRefreshPosition.top);
    const loadingStatus = useRef<PullRefreshLoading>(PullRefreshLoading.none);
    const [percent, setPercent] = useState(0);

    const start = useRef(null);
    const offset = useRef<number>(null);

    const ref = useRef(null);
    const contentRef = useRef(null);
    const topIndicator = useRef(null);

    function onTouchStart(e: React.TouchEvent<HTMLElement>) {
        start.current = e.touches[0].clientY;
        if (position.current !== PullRefreshPosition.middle) {
            offset.current = 0;
        }
        if (touchStart) {
            touchStart(e);
        }
    }

    function onTouchMove(e: React.TouchEvent<HTMLElement>) {
        const target = e.target as any;
        const wrapper = e.currentTarget as HTMLElement;
        const content = contentRef.current as HTMLElement;
        const point = e.touches[0];
        const _offset = point.clientY - start.current;
        offset.current = _offset;

        target.stopPropagation = false;

        // 阻止滚动条, 修复ios拖拽显示出浏览器背景问题
        if (content.scrollHeight > wrapper.offsetHeight) {
            if (position.current === PullRefreshPosition.bottom) {
                if (_offset >= 0) {
                    target.stopPropagation = true;
                }
            } else if (position.current === PullRefreshPosition.top) {
                if (_offset < 0) {
                    console.log("设置!");
                    target.stopPropagation = true;
                }
            } else {
                target.stopPropagation = true;
            }
        }

        if (position.current === PullRefreshPosition.top) {
            // 设置上拉指示符的状态
            if (pullRefreshStatus !== PullRefreshPositionStatus.refreshing) {
                setPercent(_offset / threshold);
                if (_offset > threshold && pullRefreshStatus !== PullRefreshPositionStatus.overRefreshPort) {
                    setPullRefreshStatus(PullRefreshPositionStatus.overRefreshPort);
                }
                if (_offset < threshold && pullRefreshStatus !== PullRefreshPositionStatus.notEnoughRefreshPort) {
                    setPullRefreshStatus(PullRefreshPositionStatus.notEnoughRefreshPort);
                }
            }
        }

        if (position.current !== PullRefreshPosition.middle) {
            // 设置上拉，下拉距离
            // Tips offset * 0.3 为了计算阻力
            setContentStyle({ transform: `translate3d(0px, ${_offset * 0.3}px, 0px)`, transition: "none" });
        }

        if (touchMove) {
            touchMove(e, _offset);
        }
    }

    function onTouchEnd(e: React.TouchEvent<HTMLElement>) {
        const target = e.currentTarget as HTMLElement;
        const content = contentRef.current as HTMLElement;
        const topElement = topIndicator.current as HTMLElement;
        if (content.scrollHeight < target.offsetHeight && offset.current < 0 && Math.abs(offset.current) >= threshold) {
            loadData();
        }

        if (position.current !== PullRefreshPosition.middle) {
            if (position.current === PullRefreshPosition.bottom || offset.current <= threshold) {
                setContentStyle({ transform: `translate3d(0px, 0px, 0px)`, transition: null });
                start.current = null;
            } else if (enablePullRefresh) {
                setContentStyle({ transform: `translate3d(0px, ${topElement.offsetHeight}px, 0px)`, transition: null });
                if (loadingStatus.current !== PullRefreshLoading.refreshing) {
                    setPullRefreshStatus(PullRefreshPositionStatus.refreshing);
                }
                start.current = null;
                refresh();
            }
        } else {
            setContentStyle({ transform: `translate3d(0px, 0px, 0px)`, transition: null });
        }

        if (touchEnd) {
            touchEnd(e);
        }
    }

    function onScroll(e: React.UIEvent<HTMLDivElement>) {
        const target = e.currentTarget as HTMLElement;
        position.current = getScrollPosition(target);
        if (position.current === PullRefreshPosition.bottom) {
            loadData();
        }
    }

    function refresh() {
        if (enablePullRefresh && loadingStatus.current !== PullRefreshLoading.refreshing && onPullRefresh) {
            loadingStatus.current = PullRefreshLoading.refreshing;
            onPullRefresh();
        }
    }

    function loadData() {
        if (enableLoadMore && loadingStatus.current !== PullRefreshLoading.loadData && !isNoMoreData && onLoadMore) {
            loadingStatus.current = PullRefreshLoading.loadData;
            onLoadMore();
        }
    }

    function renderTopIndicator() {
        if (!enablePullRefresh) {
            return null;
        }

        return (
            <div className={classNames(`${prefixCls}-indicator`, "top")} ref={topIndicator}>
                <div className={`${prefixCls}-indicator-notEnoughRefreshPort`} style={{ display: pullRefreshStatus === PullRefreshPositionStatus.notEnoughRefreshPort ? "block" : "none" }}>
                    {notEnoughRefreshNode instanceof Function ? notEnoughRefreshNode(percent * 100) : notEnoughRefreshNode}
                </div>
                <div className={`${prefixCls}-indicator-overRefreshPort`} style={{ display: pullRefreshStatus === PullRefreshPositionStatus.overRefreshPort ? "block" : "none" }}>
                    {overRefreshNode}
                </div>
                <div className={`${prefixCls}-indicator-refreshing`} style={{ display: pullRefreshStatus === PullRefreshPositionStatus.refreshing ? "block" : "none" }}>
                    <img src={LoadingSvg} alt="refresh data" />
                </div>
            </div>
        );
    }

    function renderBottomIndicator() {
        return (
            <div className={classNames(`${prefixCls}-indicator`, "bottom")} onClick={loadData}>
                {loading && loadingStatus.current === PullRefreshLoading.loadData ? (
                    <div className={classNames(`${prefixCls}-indicator`, "bottom")}>
                        <img src={LoadingSvg} alt="load data" />
                    </div>
                ) : (
                    enableLoadMore && (
                        <div className={classNames(`${prefixCls}-indicator`, "bottom")} onClick={loadData}>
                            {isNoMoreData ? noMoreDataNode : bottomIndicatorTips}
                        </div>
                    )
                )}
            </div>
        );
    }

    function setContentStyle(style: React.CSSProperties) {
        const content = contentRef.current as HTMLElement;
        if (content) {
            for (let key in style) {
                content.style[key] = style[key];
            }
        }
    }

    useEffect(() => {
        let timehandle: any;
        if (!loading && loadingStatus.current === PullRefreshLoading.refreshing) {
            setContentStyle({ transform: `translate3d(0px, 0px, 0px)`, transition: null });
            timehandle = window.setTimeout(() => {
                setPullRefreshStatus(PullRefreshPositionStatus.notEnoughRefreshPort);
            }, 300);
        }
        if (!loading) {
            loadingStatus.current = PullRefreshLoading.none;
            position.current = getScrollPosition(ref.current as HTMLElement);
        }
        return () => window.clearTimeout(timehandle);
    }, [loading]);

    useMount(() => {
        // 初次没有数据, 加载数据
        if (!initLock) {
            loadData();
        }
    });

    useMount(() => {
        function stopFunc(e: TouchEvent) {
            const target = e.target as any;
            if (!target || !target.stopPropagation) {
                e.preventDefault();
            }
        }
        document.addEventListener("touchmove", stopFunc, { passive: false });
        return () => document.removeEventListener("touchmove", stopFunc);
    });

    useEffect(() => {
        if (refProps) {
            if (refProps instanceof Function) {
                refProps(ref.current);
            } else {
                refProps.current = ref.current;
            }
        }
    }, [ref.current]);

    return (
        <div className={classNames(prefixCls, className)} style={style} onScroll={onScroll} ref={ref} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} onTouchCancel={onTouchEnd}>
            <div className={`${prefixCls}-wrapper`}>
                <div className={`${prefixCls}-content`} ref={contentRef}>
                    {renderTopIndicator()}
                    <div>{children}</div>
                    {renderBottomIndicator()}
                </div>
            </div>
        </div>
    );
});

export default React.memo(PullRefresh);
