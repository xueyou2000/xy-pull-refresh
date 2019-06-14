/**
 * 进度0~100
 */
export type GetPullRefreshNode = (percent: number) => React.ReactNode;

export interface PullRefreshProps {
    /**
     * 附加类名
     */
    prefixCls?: string;
    /**
     * 根节点的附加类名
     */
    className?: string;
    /**
     * 内联样式
     */
    style?: React.CSSProperties;
    /**
     * 内容
     */
    children?: React.ReactNode;
    /**
     * 是否正在加载
     */
    loading?: boolean;
    /**
     * 是否没有更多数据
     */
    isNoMoreData?: boolean;
    /**
     * 是否开启加载更多
     * @description 滚动到底部会触发加载更多事件
     */
    enableLoadMore?: boolean;
    /**
     * 是否开启下拉刷新
     */
    enablePullRefresh?: boolean;
    /**
     * 是否初始化锁定
     * @description 在多个tab情况下，默认不是当前激活tab的，不需要主动去加载数据
     */
    initLock?: boolean;
    /**
     * 阈值
     * @description 滚动到底部加载的距离
     */
    threshold?: number;
    /**
     * 加载更多事件
     */
    onLoadMore?: Function;
    /**
     * 下拉刷新事件
     */
    onPullRefresh?: Function;
    /**
     * 没有数据元素
     */
    noMoreDataNode?: React.ReactNode;
    /**
     * 上滑加载提示元素
     */
    bottomIndicatorTips?: React.ReactNode;
    /**
     * 不够下拉刷新时提示
     */
    notEnoughRefreshNode?: React.ReactNode | GetPullRefreshNode;
    /**
     * 足够下拉刷新时提示
     */
    overRefreshNode?: React.ReactNode;
    /**
     * onTouchStart事件
     */
    onTouchStart?: Function;
    /**
     * onTouchMove事件
     */
    onTouchMove?: Function;
    /**
     * onTouchEnd事件
     */
    onTouchEnd?: Function;
}

export interface CircleProps {
    /**
     * 附加类名
     */
    prefixCls?: string;
    /**
     * 根节点的附加类名
     */
    className?: string;
    /**
     * 内联样式
     */
    style?: React.CSSProperties;
    /**
     * 边框宽度
     * @description 默认1
     */
    strokeWidth?: number;
    /**
     * 边框颜色
     * @description 默认#2db7f5
     */
    strokeColor?: string | string[];
    /**
     * 轨迹宽度
     * @description 默认1
     */
    trailWidth?: number;
    /**
     * 轨迹颜色
     * @description 默认#D9D9D9
     */
    trailColor?: string;
    /**
     * 进度条结束时的形状
     * @description 默认round
     */
    strokeLinecap?: "butt" | "round" | "square";
    /**
     * 进度
     * @description 范围 0 ~ 100
     */
    percent?: number | number[];
    /**
     * 半圆的间隙
     * @description  0 ~ 360
     */
    gapDegree?: number;
    /**
     * 间隙位置
     * @description 默认 top
     */
    gapPosition?: "top" | "bottom" | "left" | "right";
    /**
     * 是否不显示过渡
     */
    notransition?: boolean;
}
