import useLocalStorage from '../hooks/useLocalStorage';

export const LS_PREFIX = 'Converse';

function getUser() {
  const { getItem } = useLocalStorage();

  return getItem(`${LS_PREFIX}-user`);
}

export { getUser };
