import React, { useState } from "react";
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
    for (let i = 0; i < 20; ++i) {
        data.push(faker.name.findName());
    }

    return data;
}

export default function() {
    const [loading, setLoading] = useState(false);
    const [names, setNames] = useState(createData(20));

    function loadData() {
        setLoading(true);
        setTimeout(() => {
            setNames([...names, ...createData(10)]);
            setLoading(false);
        }, 15000);
    }

    return (
        <PullRefresh className="employee-page" loading={loading} onLoadMore={loadData}>
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
    );
}
