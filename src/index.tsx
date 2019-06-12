import React, { useRef, useEffect, useState, useCallback } from "react";
import classNames from "classnames";
import { PullRefreshProps } from "./interface";
import LoadingSvg from "../assets/loading.svg";
import { useMount } from "utils-hooks";
import "./tools";
import { getScrollPosition } from "./tools";

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

function PullRefresh(props: PullRefreshProps) {
    const { prefixCls = "xy-pull-refresh", className, style, children, loading = false, isNoMoreData = false, enableLoadMore = true, enablePullRefresh = false, initLock = false, threshold = 100, onLoadMore, onPullRefresh } = props;
    const [pullRefreshStatus, setPullRefreshStatus] = useState<PullRefreshPositionStatus>(PullRefreshPositionStatus.notEnoughRefreshPort);
    const position = useRef<PullRefreshPosition>(PullRefreshPosition.top);
    const loadingStatus = useRef<PullRefreshLoading>(PullRefreshLoading.none);

    const start = useRef(null);
    const offset = useRef<number>(null);

    const ref = useRef(null);
    const contentRef = useRef(null);
    const topIndicator = useRef(null);

    function onTouchStart(e: TouchEvent) {
        if (position.current !== PullRefreshPosition.middle) {
            offset.current = 0;
            start.current = e.touches[0].clientY;
        }
    }

    function onTouchMove(e: TouchEvent) {
        const target = e.currentTarget as HTMLElement;
        const content = contentRef.current as HTMLElement;
        const point = e.touches[0];
        const _offset = point.clientY - start.current;
        offset.current = _offset;

        // 阻止滚动条, 修复ios拖拽显示出浏览器背景问题
        if (content.scrollHeight > target.offsetHeight) {
            if (position.current === PullRefreshPosition.bottom) {
                if (_offset >= 0) {
                    e.stopPropagation();
                }
            } else if (position.current === PullRefreshPosition.top) {
                if (_offset < 0) {
                    e.stopPropagation();
                }
            } else {
                e.stopPropagation();
            }
        }

        if (position.current === PullRefreshPosition.top) {
            // 设置上拉指示符的状态
            if (pullRefreshStatus !== PullRefreshPositionStatus.refreshing) {
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
    }

    function onTouchEnd(e: TouchEvent) {
        const topElement = topIndicator.current as HTMLElement;
        if (position.current !== PullRefreshPosition.middle) {
            if (position.current === PullRefreshPosition.bottom || offset.current < threshold) {
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
                    <p>下拉刷新</p>
                </div>
                <div className={`${prefixCls}-indicator-overRefreshPort`} style={{ display: pullRefreshStatus === PullRefreshPositionStatus.overRefreshPort ? "block" : "none" }}>
                    <p>松开刷新</p>
                </div>
                <div className={`${prefixCls}-indicator-refreshing`} style={{ display: pullRefreshStatus === PullRefreshPositionStatus.refreshing ? "block" : "none" }}>
                    <img src={LoadingSvg} alt="refresh data" />
                </div>
            </div>
        );
    }

    function renderBottomIndicator() {
        if (loading && loadingStatus.current === PullRefreshLoading.loadData) {
            return (
                <div className={classNames(`${prefixCls}-indicator`, "bottom")}>
                    <img src={LoadingSvg} alt="load data" />
                </div>
            );
        }

        if (enableLoadMore) {
            return (
                <div className={classNames(`${prefixCls}-indicator`, "bottom")} onClick={loadData}>
                    {isNoMoreData ? "没有更多数据" : "上滑加载数据"}
                </div>
            );
        } else {
            return null;
        }
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
        if (!loading && loadingStatus.current === PullRefreshLoading.refreshing) {
            setContentStyle({ transform: `translate3d(0px, 0px, 0px)`, transition: null });
            setPullRefreshStatus(PullRefreshPositionStatus.notEnoughRefreshPort);
        }
        if (!loading) {
            loadingStatus.current = PullRefreshLoading.none;
            position.current = getScrollPosition(ref.current as HTMLElement);
        }
    }, [loading]);

    useMount(() => {
        // 初次没有数据, 加载数据
        if (!initLock) {
            loadData();
        }
    });

    useEffect(() => {
        const element = ref.current as HTMLElement;
        if (!element) {
            return;
        }

        element.addEventListener("touchstart", onTouchStart);
        element.addEventListener("touchmove", onTouchMove);
        element.addEventListener("touchend", onTouchEnd);

        return () => {
            element.removeEventListener("touchstart", onTouchStart);
            element.removeEventListener("touchmove", onTouchMove);
            element.removeEventListener("touchend", onTouchEnd);
        };
    }, [ref.current, pullRefreshStatus, loading]);

    return (
        <div className={classNames(prefixCls, className)} style={style} onScroll={onScroll} ref={ref}>
            <div className={`${prefixCls}-wrapper`}>
                <div className={`${prefixCls}-content`} ref={contentRef}>
                    {renderTopIndicator()}
                    <div>{children}</div>
                    {renderBottomIndicator()}
                </div>
            </div>
        </div>
    );
}

export default React.memo(PullRefresh);
