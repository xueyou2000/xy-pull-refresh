import React, { useEffect, useRef } from "react";
import classNames from "classnames";
import { CircleProps } from "./interface";
import { useTranstion } from "utils-hooks";

function getPathStyles(offset: number, percent: number, strokeColor: string = "#2db7f5", strokeWidth: number = 1, gapDegree: number = 0, gapPosition: "top" | "bottom" | "left" | "right" = "top", notransition: boolean = false) {
    const radius = 50 - strokeWidth / 2;
    let beginPositionX = 0;
    let beginPositionY = -radius;
    let endPositionX = 0;
    let endPositionY = -2 * radius;
    switch (gapPosition) {
        case "left":
            beginPositionX = -radius;
            beginPositionY = 0;
            endPositionX = 2 * radius;
            endPositionY = 0;
            break;
        case "right":
            beginPositionX = radius;
            beginPositionY = 0;
            endPositionX = -2 * radius;
            endPositionY = 0;
            break;
        case "bottom":
            beginPositionY = radius;
            endPositionY = 2 * radius;
            break;
        default:
    }
    const pathString = `M 50,50 m ${beginPositionX},${beginPositionY}
     a ${radius},${radius} 0 1 1 ${endPositionX},${-endPositionY}
     a ${radius},${radius} 0 1 1 ${-endPositionX},${endPositionY}`;
    const len = Math.PI * 2 * radius;

    const pathStyle: React.CSSProperties = {
        stroke: strokeColor,
        strokeDasharray: `${(percent / 100) * (len - gapDegree)}px ${len}px`,
        strokeDashoffset: `-${gapDegree / 2 + (offset / 100) * (len - gapDegree)}px`,
        transition: notransition ? null : "stroke-dashoffset .3s ease 0s, stroke-dasharray .3s ease 0s, stroke .3s, stroke-width .06s ease .3s" // eslint-disable-line
    };

    return {
        pathString,
        pathStyle
    };
}

/**
 * 原型进度条
 * @see https://github.com/react-component/progress/blob/master/src/Circle.js
 */
function Circle(props: CircleProps) {
    const {
        prefixCls = "xy-progress-circle",
        className,
        style,
        strokeWidth = 1,
        strokeColor = "#2db7f5",
        trailWidth = 1,
        trailColor = "#D9D9D9",
        strokeLinecap = "round",
        percent = 0,
        gapDegree = 0,
        gapPosition = "top",
        notransition = false
    } = props;
    const { pathString, pathStyle } = getPathStyles(0, 100, trailColor, strokeWidth, gapDegree, gapPosition, notransition);
    function getStokeList() {
        const percentList = Array.isArray(percent) ? percent : [percent];
        const strokeColorList = Array.isArray(strokeColor) ? strokeColor : [strokeColor];

        let stackPtg = 0;
        return percentList.map((ptg, index) => {
            const color = strokeColorList[index] || strokeColorList[strokeColorList.length - 1];
            const { pathString, pathStyle } = getPathStyles(stackPtg, ptg, color, strokeWidth, gapDegree, gapPosition, notransition);
            // pathStyle.opacity = ptg === 0 ? 0 : 1;
            stackPtg += ptg;

            return <path key={index} className={`${prefixCls}-circle-path`} d={pathString} strokeLinecap={strokeLinecap} strokeWidth={strokeWidth} fillOpacity="0" style={pathStyle} />;
        });
    }

    useEffect(() => {}, [percent]);

    return (
        <svg className={classNames(prefixCls, className)} style={style} viewBox="0 0 100 100">
            <path className={`${prefixCls}-trail`} d={pathString} stroke={trailColor} strokeLinecap={strokeLinecap} strokeWidth={trailWidth || strokeWidth} fillOpacity="0" style={pathStyle} />
            {getStokeList().reverse()}
        </svg>
    );
}

export default React.memo(Circle);
