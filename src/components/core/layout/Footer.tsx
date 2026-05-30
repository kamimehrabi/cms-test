"use client"
import Script from 'next/script';

const Footer = ({ script }: { script: string }) => {
    
    return (
        <>
            {/* <CustomElement element={"footer-container"} /> */}
            {/* @ts-ignore */}
            <footer-container></footer-container>
            <Script strategy='afterInteractive' type="module" dangerouslySetInnerHTML={{ __html: script }} />
        </>
    )
}

export default Footer