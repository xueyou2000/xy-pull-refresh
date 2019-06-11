import { PullRefreshPosition } from ".";

//not draggable
document.addEventListener(
    "touchmove",
    function(e) {
        e.preventDefault();
    },
    { passive: false }
);

export function getScrollPosition(target: HTMLElement) {
    let position: PullRefreshPosition;
    if (target.scrollTop <= 0) {
        position = PullRefreshPosition.top;
    } else if (target.scrollTop >= target.scrollHeight - target.offsetHeight) {
        position = PullRefreshPosition.bottom;
    } else {
        position = PullRefreshPosition.middle;
    }
    return position;
}
