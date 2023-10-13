import EmptyState from '@/components/emptyState/EmptyState';

const NotFound = () => {
  return (
    <>
      <EmptyState type="warning" description="페이지가 존재하지 않습니다." />
    </>
  )
}
export default NotFound;