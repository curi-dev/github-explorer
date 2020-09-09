import React, { useState, FormEvent, useEffect } from 'react';
import { FiChevronRight } from 'react-icons/fi';

import api from '../../services/api';

import { Title, Form, Repository, Error } from './styles';
import logoIcon from '../../assets/logo.svg';

interface Repositories {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashboard: React.FunctionComponent = () => {
  // eslint-disable-next-line
  const [newRepo, setNewRepo] = useState('');
  // eslint-disable-next-line
  const [repositories, setRepositories] = useState<Repositories[]>(() => {
    const storagedRepositories = localStorage.getItem(
      '@GithubExplorer: repositories',
    );

    if (storagedRepositories) {
      return JSON.parse(storagedRepositories);
    }
    return [];
  });
  // eslint-disable-next-line
  const [inputError, setInputError] = useState('');

  useEffect(() => {
    // Ao invés de colocar dentro da handleAdd, pois posso efetuar outras operações com repositories
    localStorage.setItem(
      '@GithubExplorer: repositories',
      JSON.stringify(repositories),
    );
  }, [repositories]);

  async function handleAddRepository(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (!newRepo) {
      setInputError('Você deve preencher o campo com usuário/repositório.');
      return;
    }

    try {
      const response = await api.get(`repos/${newRepo}`);
      const repository = response.data;
      setNewRepo('');
      setRepositories([...repositories, repository]);

      setInputError('');
    } catch (error) {
      setInputError('Repositório não encontrado.');
    }
  }

  return (
    <>
      <img src={logoIcon} alt="Github explorer" />
      <Title>Explore repositórios no GitHub.</Title>

      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input
          type="text"
          placeholder="Digite o repositório aqui..."
          value={newRepo}
          onChange={e => setNewRepo(e.target.value)}
        />
        <button type="submit">Pesquisar</button>
      </Form>
      {inputError && <Error>{inputError}</Error>}
      <Repository>
        {repositories.map(repository => (
          <a href="repo" key={repository.full_name}>
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
            <FiChevronRight size={20} />
          </a>
        ))}
      </Repository>
    </>
  );
};

export default Dashboard;
