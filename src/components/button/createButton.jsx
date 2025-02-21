import {PlusCircle} from 'react-feather';
import styled from 'styled-components';

const CreateButtonx = styled.button`
	background-color: #1db954;
	color: white;
	border: none;
	padding: 8px 12px;
	border-radius: 10px;
	cursor: pointer;
`;

const CreateButton = ({onClick, children, type = 'button'}) => {
	return (
		<CreateButtonx onClick={onClick} type={type}>
			<PlusCircle></PlusCircle>
			{children}
		</CreateButtonx>
	);
};

export default CreateButton;
