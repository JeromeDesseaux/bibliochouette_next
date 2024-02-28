import React, { type ReactNode } from 'react';
import styled from 'styled-components';

const DashboardWrapper = styled.div`
    display: flex;
    flex-direction: row;
    min-height: 100vh;
`;

const ContentWrapper = styled.div`
    display: flex;
    flex-grow: 1;
    padding: 20px;
    flex-direction: column;
`;

const Sidebar = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5;
    min-height: 100vh;
    width: 300px;
    padding: 20px;
`;

export default function MainLayout({ children }: { children: ReactNode }) {
    return (<DashboardWrapper>
        <Sidebar>
            Sidebar
        </Sidebar>
        <ContentWrapper>
            {children}
        </ContentWrapper>
    </DashboardWrapper>);
}
