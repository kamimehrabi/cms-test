
export default function NextLink(props: any) {
    return (
        <a href={props.href} className={props.className} onClick={(event: any) => {
            event.preventDefault()
            if (!window.__editMode) {
                window.dispatchEvent(new CustomEvent('widget-navigation', {
                    detail: { route: props.href }
                }))
            }
        }} style={{ cursor: 'pointer' }}>{props.children}</a>
    )
}
