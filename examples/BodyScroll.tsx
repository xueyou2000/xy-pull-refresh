import React, { useState, useRef, useEffect } from "react";
import PullRefresh from "../src";
import "./index.scss";
import randomColor from "randomcolor";
import faker from "faker";

function Avatar({ name }: { name: string }) {
    const initials = name[0].toUpperCase();

    return (
        <span className="avatar" style={{ backgroundColor: randomColor({ luminosity: "light", alpha: 0.7 }) as string }}>
            <span className="avatar-name">{initials}</span>
        </span>
    );
}

function createData(count = 20) {
    const data = [];
    for (let i = 0; i < count; ++i) {
        data.push(faker.name.findName());
    }

    return data;
}

export default function() {
    const [loading, setLoading] = useState(false);
    const [isNoMoreData, setisNoMoreData] = useState(false);
    const [names, setNames] = useState(createData(5));
    const [height, setHeight] = useState(document.documentElement.clientHeight);
    const [hidden, setHidden] = useState(false);

    function loadData() {
        setLoading(true);
        setTimeout(() => {
            const data = [...names, ...createData(10)];
            setNames(data);
            if (data.length > 30) {
                setisNoMoreData(true);
            }
            setLoading(false);
        }, 3000);
    }

    function refresh() {
        setLoading(true);
        setTimeout(() => {
            setNames(createData(5));
            setLoading(false);
            setisNoMoreData(false);
        }, 1000);
    }

    function saveRef(ele: HTMLElement) {
        if (ele) {
            setHeight(document.documentElement.clientHeight - ele.offsetTop);
        }
    }

    // function onTouchStart(e: TouchEvent) {
    //     lastPoint.current === null;
    // }

    function onTouchMove(e: TouchEvent, offset: number) {
        const target = e.currentTarget as HTMLElement;
        if (Math.abs(offset) > 20) {
            if (offset < 0 && !hidden) {
                setHidden(true);
                setTimeout(() => {
                    setHeight(document.documentElement.clientHeight - target.offsetTop);
                }, 300);
            } else if (offset >= 0 && hidden) {
                setHidden(false);
                setTimeout(() => {
                    setHeight(document.documentElement.clientHeight - target.offsetTop);
                }, 300);
            }
        }

        // const changeDirection = lastPoint.current === null || lastPoint.current > 0 !== point.clientY > 0;
        // if (changeDirection) {
        //     lastPoint.current = point.clientY;
        // } else {
        //     if (Math.abs(point.clientY) - Math.abs(lastPoint.current) > 150) {
        //         if ()
        //     }
        // }
    }

    return (
        <div>
            <div className={`block ${hidden ? "hidden" : ""}`}>
                <p>下面使用body作为滚动条</p>
            </div>
            <PullRefresh
                ref={saveRef}
                className="employee-page"
                onLoadMore={loadData}
                onTouchMove={onTouchMove}
                onPullRefresh={refresh}
                loading={loading}
                style={{ height }}
                enablePullRefresh={true}
                isNoMoreData={isNoMoreData}
            >
                <ul className="employee-list">
                    {names.map((x) => (
                        <li key={x} tabIndex={0}>
                            <Avatar name={x} />
                            <div className="employee-summary">
                                <p className="employee-name">{x}</p>
                                <p className="employee-job-title">{faker.name.jobTitle()}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </PullRefresh>
        </div>
    );
}
