import React, { useRef, useEffect, useState } from "react";
import ReactDOM from "react-dom";
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

function PullRefresh(props: PullRefreshProps) {
    const { prefixCls = "xy-pull-refresh", className, style, children, loading = false, isNoMoreData = false, useBodyScroll = false, enableLoadMore = true, enablePullRefresh = false, initLock = false, threshold = 50, onLoadMore } = props;
    const [contentStyle, setContentStyle] = useState<React.CSSProperties>(null);
    const position = useRef<PullRefreshPosition>(PullRefreshPosition.top);
    const start = useRef(null);
    const ref = useRef(null);

    function onTouchStart(e: TouchEvent) {
        if (position.current !== PullRefreshPosition.middle) {
            start.current = e.touches[0].clientY;
        }
    }

    function onTouchMove(e: TouchEvent) {
        const point = e.touches[0];
        const offset = point.clientY - start.current;

        if (position.current === PullRefreshPosition.top) {
            if (offset < 0) {
                e.stopPropagation();
            }
        } else if (position.current === PullRefreshPosition.bottom) {
            if (offset > 0) {
                e.stopPropagation();
            } else {
            }
        } else {
            e.stopPropagation();
        }

        if (position.current !== PullRefreshPosition.middle) {
            // console.log(point, offset);
            // Tips offset * 0.3 为了计算阻力
            setContentStyle({ transform: `translate3d(0px, ${offset * 0.3}px, 0px)`, transition: "none" });
        }
    }

    function onTouchEnd(e: TouchEvent) {
        start.current = null;
        setContentStyle({ transform: `translate3d(0px, 0px, 0px)` });
    }

    function onScroll(e: React.UIEvent<HTMLDivElement>) {
        const target = e.currentTarget as HTMLElement;
        position.current = getScrollPosition(target);
        if (position.current === PullRefreshPosition.bottom) {
            loadData();
        }
    }

    function loadData() {
        if (enableLoadMore && !loading && !isNoMoreData && onLoadMore) {
            onLoadMore();
        }
    }

    function renderTopIndicator() {
        if (position.current === PullRefreshPosition.top && enablePullRefresh) {
            // todo
            return null;
        } else {
            return null;
        }
    }

    function renderDownIndicator() {
        if ((position.current === PullRefreshPosition.bottom || loading) && enableLoadMore) {
            return <div className={classNames(`${prefixCls}-indicator`, "down")}>{loading && <img src={LoadingSvg} alt="load data" />}</div>;
        } else {
            return null;
        }
    }

    useEffect(() => {
        const element = ref.current as HTMLElement;
        if (!loading && element) {
            position.current = getScrollPosition(element);
        }
    }, [loading]);

    useMount(() => {
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
    }, [ref.current]);

    return (
        <div className={classNames(prefixCls, className)} style={style} ref={ref} onScroll={onScroll}>
            <div className={`${prefixCls}-wrapper`}>
                <div className={`${prefixCls}-content`} style={contentStyle}>
                    {renderTopIndicator()}
                    <div>{children}</div>
                    {renderDownIndicator()}
                </div>
            </div>
        </div>
    );
}

export default React.memo(PullRefresh);
