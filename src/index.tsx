import React, { useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";
import { PullRefreshProps } from "./interface";
import LoadingSvg from "../assets/loading.svg";
import { useMount } from "utils-hooks";

function PullRefresh(props: PullRefreshProps) {
    const { prefixCls = "xy-pull-refresh", className, style, children, loading = false, isNoMoreData = false, useBodyScroll = false, enableLoadMore = true, enablePullRefresh = false, initLock = false, threshold = 50, onLoadMore } = props;
    const isTop = useRef(false);
    const isBootom = useRef(false);

    function onTouchStart(e: React.TouchEvent<HTMLElement>) {}

    function onTouchMove(e: React.TouchEvent<HTMLElement>) {}

    function onTouchEnd(e: React.TouchEvent<HTMLElement>) {}

    function onScroll(e: React.UIEvent<HTMLDivElement>) {
        const target = e.currentTarget as HTMLElement;

        if (target.scrollTop <= 0) {
            console.log("到顶部了");
            isTop.current = true;
        } else if (target.scrollTop >= target.scrollHeight - target.offsetHeight) {
            console.log("到底部了");
            isBootom.current = true;
            loadData();
        } else {
            isTop.current = false;
            isBootom.current = false;
        }
    }

    function loadData() {
        if (!enableLoadMore || loading || isNoMoreData || !onLoadMore) {
            return;
        }
        onLoadMore();
    }

    function renderUpIndicator() {
        if (isTop.current && enablePullRefresh) {
            return null;
        } else {
            return null;
        }
    }

    function renderDownIndicator() {
        if (isBootom.current && enableLoadMore) {
            return <div className={classNames(`${prefixCls}-indicator`, "down")}>{loading && <img src={LoadingSvg} alt="load data" />}</div>;
        } else {
            return null;
        }
    }

    useEffect(() => {
        if (!loading) {
            isTop.current = false;
            isBootom.current = false;
        }
    }, [loading]);

    useMount(() => {
        if (!initLock) {
            isBootom.current = true;
            loadData();
        }
    });

    return (
        <div className={classNames(prefixCls, className)} style={style} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} onScroll={onScroll}>
            <div className={`${prefixCls}-wrapper`}>
                <div className={`${prefixCls}-content`}>
                    {renderUpIndicator()}
                    <div>{children}</div>
                    {renderDownIndicator()}
                </div>
            </div>
        </div>
    );
}

export default React.memo(PullRefresh);
