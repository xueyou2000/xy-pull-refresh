import React from "react";
import { render } from "@testing-library/react";
import PullRefresh from "../src";

describe("PullRefresh", () => {
    test("render", () => {
        const wrapper = render(
            <PullRefresh style={{ height: "500px" }}>
                <ul>
                    <li>A</li>
                    <li>B</li>
                    <li>C</li>
                </ul>
            </PullRefresh>,
        );
        const pullRefresh = wrapper.container.querySelector(".xy-pull-refresh");
        expect(pullRefresh).toBeDefined();
    });
});
