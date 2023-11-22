import { PageModel } from '@/models/model/PageModel';

export const PagingUtil = (data: any, page: PageModel) => {
	page.totalCount = data.length
	page.totalPage = data.length / page.pageSize
	return page
}

export const setPageList = (page: PageModel, oriList: Array<any>, setState: React.Dispatch<React.SetStateAction<Array<any>>>) => {
	let pageStart = page.pageSize * page.page

	if (pageStart < 0) {
		pageStart = 0
	}
	let pageEnd = pageStart + page.pageSize
	if (pageEnd > page.totalCount) {
		pageEnd = page.totalCount
	}
	const newRows = oriList.slice(pageStart, pageEnd)
	setState(newRows)
}
