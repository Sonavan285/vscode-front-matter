import * as React from 'react';

export interface ILogoProps {
  className: string;
}

export const Logo: React.FunctionComponent<ILogoProps> = ({className}: React.PropsWithChildren<ILogoProps>) => {
  return (
    <svg className={className || ""} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30"><path d="M4,11.4H2.2V2.9H5.4v2H4V6.1H5.3V8H4Z" transform="translate(1 1)" fill="currentcolor"/><path d="M10.9,11.4H9l-.9-3V8.2C8,8.1,8,8,7.9,7.8v3.6H6.1V2.9H8a2.88,2.88,0,0,1,1.9.6,3.11,3.11,0,0,1,.8,2.2A2.25,2.25,0,0,1,9.6,7.8ZM8,6.8h.1a.55.55,0,0,0,.5-.3,1.88,1.88,0,0,0,.2-.8c0-.6-.3-1-.8-1H8Z" transform="translate(1 1)" fill="currentcolor"/><path d="M16.5,7.2a6.08,6.08,0,0,1-.7,3.2A2.14,2.14,0,0,1,14,11.6a2.09,2.09,0,0,1-1.7-.9,5.84,5.84,0,0,1-.9-3.5,5.84,5.84,0,0,1,.9-3.5A2.09,2.09,0,0,1,14,2.8,2.16,2.16,0,0,1,15.9,4,8.24,8.24,0,0,1,16.5,7.2Zm-1.9,0c0-1.5-.2-2.3-.7-2.3-.2,0-.4.2-.5.6a6.53,6.53,0,0,0-.2,1.7,7.18,7.18,0,0,0,.2,1.7c.1.4.3.6.5.6s.4-.2.5-.6A7.93,7.93,0,0,0,14.6,7.2Z" transform="translate(1 1)" fill="currentcolor"/><path d="M17.2,11.4V2.9H19l.9,3c.1.1.1.3.2.6s.1.5.2.8l.2.7c-.1-.7-.1-1.4-.2-1.9a6.64,6.64,0,0,1-.1-1.3V2.9H22v8.5H20.3l-.9-3.1-.3-.9c-.1-.3-.1-.6-.2-.8,0,.6.1,1.1.1,1.6v3.4H17.2Z" transform="translate(1 1)" fill="currentcolor"/><path d="M25.3,11.4H23.5V4.9h-1v-2h3.9v2H25.3Z" transform="translate(1 1)" fill="currentcolor"/><rect x="1" y="1" width="28" height="28" fill="none" stroke="currentcolor" strokeMiterlimit="10" strokeWidth="2"/><path d="M2.9,17h.9l.6,3a5,5,0,0,1,.2,1.2c.1.4.1.8.2,1.2v-.2l.2-.9.1-.8.1-.5.6-3h.9l.7,7.5h-1l-.2-2.6V19.5h0v.1a.9.9,0,0,1-.1.5c-.1.2,0,.2-.1.3l-.1.7v.3l-.6,3.3H4.5l-.6-2.8a5.16,5.16,0,0,1-.2-1.1c-.1-.4-.1-.8-.2-1.2l-.3,5.2h-1Z" transform="translate(1 1)" fill="currentcolor"/><path d="M9.3,17h.8l1.6,7.5h-1L10.4,23H8.9l-.3,1.5h-1Zm1,5.2L10,21c-.1-.8-.3-1.7-.4-2.6a6.75,6.75,0,0,1-.2,1.4l-.3,1.5-.2,1h1.4Z" transform="translate(1 1)" fill="currentcolor"/><path d="M11.5,17h3.3v.9H13.7v6.7h-1V17.9H11.5Z" transform="translate(1 1)" fill="currentcolor"/><path d="M14.8,17h3.3v.9H17v6.7H16V17.9H14.8Z" transform="translate(1 1)" fill="currentcolor"/><path d="M18.7,17h2.7v.9H19.7v2.4h1.5v.9H19.7v2.6h1.7v.9H18.7Z" transform="translate(1 1)" fill="currentcolor"/><path d="M22.3,17h1.3c.6,0,1,.1,1.2.4a2.35,2.35,0,0,1,.5,1.6,2.5,2.5,0,0,1-.3,1.3,1.24,1.24,0,0,1-.8.6l1.4,3.7h-1l-1.4-3.7v3.7h-1V17Zm1,3.3c.4,0,.7-.1.8-.3s.2-.5.2-.9a1.27,1.27,0,0,0-.1-.6c-.1-.2-.1-.3-.2-.4s-.2-.2-.3-.2-.3-.1-.4-.1h-.2v2.5Z" transform="translate(1 1)" fill="currentcolor"/></svg>
  );
};