'use client';

import { useAuth } from '../utils/AuthContext';
import styled from 'styled-components';

const Container = styled.div`
  padding: 2rem;
  color: white;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <Container>
      <Title>Tableau de bord</Title>
      <p>Bienvenue, {user?.email}</p>
    </Container>
  );
} 