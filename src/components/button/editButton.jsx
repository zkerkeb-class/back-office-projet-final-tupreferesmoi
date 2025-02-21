import {Edit} from 'react-feather';
import styled from 'styled-components';

const EditButtonx = styled.button`
	background-color: #1db954;
	color: white;
	border: none;
	padding: 8px 12px;
	margin: 5px;
	border-radius: 10px;
	cursor: pointer;
`;

const EditButton = ({onClick, children, type = 'button'}) => {
	return (
		<EditButtonx onClick={onClick} type={type}>
			<Edit></Edit>
			{children}
		</EditButtonx>
	);
};

export default EditButton;
