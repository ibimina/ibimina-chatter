function LinkRenderer(props: any) {
    return <a href={props.href} target="_blank">{props.children}</a>
}
export default LinkRenderer;