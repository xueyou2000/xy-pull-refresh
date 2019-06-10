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
     * 是否使用body作为滚动容器
     * @description 使用body作为滚动容器,滚动条出现在body上
     */
    useBodyScroll?: boolean;
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
     * 开始拖动事件
     */
    onTouchStart?: Function;
    /**
     * 正在拖动事件
     */
    onTouchMove?: Function;
    /**
     * 拖动完毕事件
     */
    onTouchEnd?: Function;
}
