import {Trash2} from 'react-feather';
import styled from 'styled-components';

const DeleteButtonx = styled.button`
	background-color: #f10000;
	color: white;
	border: none;
	padding: 8px 12px;
	border-radius: 5px;
	cursor: pointer;
`;

const DeleteButton = ({onClick, children, type = 'button'}) => {
	return (
		<DeleteButtonx onClick={onClick} type={type}>
			<Trash alt="Supprimer"> </Trash>
			{children}
		</DeleteButtonx>
	);
};

export default DeleteButton;
