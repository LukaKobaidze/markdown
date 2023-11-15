import styles from './Sidebar.module.scss';

interface Props extends React.HTMLAttributes<HTMLElement> {}

export default function Sidebar(props: Props) {
  const { className } = props;

  return <aside className={`${className || ''}`}></aside>;
}
