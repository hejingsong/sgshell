export function moveBox(
    node: HTMLElement, box: HTMLElement,
    parent: HTMLElement, evt: MouseEvent, yEnable: boolean = true
) {
    let isMove = true;
    const x = evt.pageX - box.offsetLeft;
    const y = evt.pageY - box.offsetTop;

    parent.onmousemove = (event) => {
        if (isMove) {
            box.style.left = (event.pageX - x) + "px";
            if (yEnable) {
                box.style.top = (event.pageY - y) + "px";
            }
        }
    };

    parent.onmouseup = (event) => {
        isMove = false;
        node.onmousemove = null;
        node.onmouseup = null;
    };
}
