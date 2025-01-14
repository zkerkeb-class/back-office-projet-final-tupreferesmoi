import style from "styled-components";

export const DashboardContainer = style.div`
    display: flex;
    flex-direction: column;
    padding: 2rem;
`;

export const Card = style.div`
    background: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const Curve = style.div`
    height: 20em;
    padding-bottom: 3rem;
`;

export const Circle = style.div`
    height: 10em;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const MetricsContainer = style.div`
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    margin-top: 1rem;
`;

export const MetricItem = style.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    gap: 0.5rem;
`;

export const DashboardTop = style.div`
    display: flex;
    gap: 2rem;
    justify-content: center;
    margin-top: 1rem;
`;
