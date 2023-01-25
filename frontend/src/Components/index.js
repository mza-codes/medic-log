import styled from "styled-components";

export const ToastWrapper = styled.main`
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    position: fixed;
    z-index: 1552;
    left: 50%;
    right: 50%;
    transform: translateX(-50%);
    width: max-content;
    min-height: 50px;
    transition: all 600ms ease-in-out;
    gap: 6px;
    color: ${(props) => props.color};
`;