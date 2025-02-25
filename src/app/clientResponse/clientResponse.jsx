
import styled from 'styled-components';


const ClientResponsex = styled.div`
    position: absolute;
    top: calc(100vh - 210px);
    left 5px;
    background-color: #212121;
    color: lightgay;
    border-radius: 15px;
    height 200px; 
    padding: 10px;
    display:flex ;
    justify-content: center;
    align-items: center;
`;


export const ClientResponse = ({message}) => {
        
    return (
        <ClientResponsex className="space-y-6">
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                <p className="text-2xl">{message}</p>
            </div>
        </ClientResponsex>
    );
} 
