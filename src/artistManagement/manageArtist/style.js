import style from 'styled-components';

export const Container = style.div`
	padding: 20px;
	max-width: 500px;
	margin: 0 auto;
`;

export const Form = style.form`
	display: flex;
	flex-direction: column;
`;

export const Label = style.label`
	font-weight: bold;
	margin-top: 10px;
`;

export const Input = style.input`
	padding: 10px;
	margin: 5px 0;
	border: 1px solid #ccc;
	border-radius: 5px;
`;

export const Button = style.button`
	margin-top: 20px;
	padding: 10px;
	background-color: #1db954;
	color: white;
	border: none;
	border-radius: 5px;
	cursor: pointer;
	font-size: 16px;
	&:hover {
		background-color: #17a744;
	}
`;

export const DeleteButton = style(Button)`
    background-color: #d9534f;
    margin-top: 10px;
    &:hover {
        background-color: #c9302c;
    }
`;
