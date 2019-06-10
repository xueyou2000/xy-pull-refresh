import React from "react";

export interface MyComponentProps {
    /**
     * 根节点附加类名
     */
    className?: string;
    /**
     * 内敛样式
     */
    style?: React.CSSProperties;
}

export function MyComponent(props: MyComponentProps) {
    return <div>Hello</div>;
}

export default MyComponent;
