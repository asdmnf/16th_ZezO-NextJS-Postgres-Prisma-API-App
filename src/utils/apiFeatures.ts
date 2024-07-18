import { PrismaClient } from "@prisma/client/extension"
import { FilterObject, PaginationObject, SearchObject, SelectType, SubSelectObject } from "./typescript/types"


// pagination
export const pagination = async (searchParams: URLSearchParams, prismaModel: PrismaClient) => {
  let paginationObject = {} as PaginationObject
  
  // set default values
  const page = Number(searchParams.get('page')) || 1
  const limit = Number(searchParams.get('limit')) || 10
  const skip = (page - 1) * limit

  // get all results
  const allResults = await prismaModel.count()

  // build pagination object
  paginationObject.limit = limit * 1 
  if (skip > 0) { 
    paginationObject.previousPage = page - 1 
  }
  paginationObject.currentPage = page
  if ( page * limit < allResults) { 
    paginationObject.nextPage = page + 1
  }
  paginationObject.totalPages = Math.ceil(allResults / limit) || 1
  paginationObject.totalResults = allResults

  return { skip, limit, paginationObject }
}

// sorting
export const sorting = async (query: string) => {
  let sort = undefined
  const sortQuery = query

  // apply regular expression and extract values
  const regex = /^([^\[\]]+)\[([^\[\]]+)\]$/;
  if (regex.test(sortQuery)) {
    const match = sortQuery.match(regex);
    const sortField = match ? match[1] : null;
    const sortOperator = match ? match[2] : null;
    const allowedSortOperators = ['asc', 'desc']
    
    if (sortOperator && !allowedSortOperators.includes(sortOperator)) {
      // invalid operator error
      return {
        sort: null,
        error: 'invalid sort operator, valid operators [asc] or [desc], example: updatedAt[desc]',
        status: 400
      }
    }
    
    // apply sort
    sort = {
      [sortField as string]: sortOperator
    }
  } else {
    // invalid format error
    return {
      sort: null,
      error: 'invalid sort format, valid sort example: updatedAt[desc]',
      status: 400
    }
  }

  return {
    sort,
    error: null,
    status: null
  }
}

// filtering
export const filtering = async (query: string) => {
  let filterObject: FilterObject
  const filterQuery = query
  // apply regular expression and extract values
  const regex = /^([^,\[\]]+)\[(gt|gte|lt|lte|equals|in|notIn)-([^,\[\]]+)\](,([^,\[\]]+)\[(gt|gte|lt|lte|equals|in|notIn)-([^,\[\]]+)\])*$/ 

  if (regex.test(filterQuery)) {
    // initial filter shape
    filterObject = {
      AND: {}
    }

    // separate filter items and loop through them and extract values
    const filterItems = filterQuery.split(",")
    filterItems.forEach(filterItem => {
      const match = filterItem.match(regex)
      const filterField = match ? match[1] : null;
      const filterOperator = match ? match[2] : null;
      const filterValue = match ? match[3] : null;

      // build filter object
      if (filterField && !filterObject.AND[filterField]) {
        filterObject.AND[filterField] = {}
      }
      if (filterField && filterOperator) {
        filterObject.AND[filterField][filterOperator] = Number(filterValue) ? Number(filterValue) : filterValue;
      }
    });
  } else {
    // invalid format error
    return {
      filterObject: null,
      error: 'invalid filter format, valid filter example: price[gt-5] or separated with (,) for multiple fields: price[gt-5],price[lt-50] - valid operators gt, gte, lt, lte, equals, in, notIn',
      status: 400
    }
  }

  return {
    filterObject,
    error: null,
    status: null
  }
}

// fields selecting with nested select
export const fieldSelecting = async (query: string) => {
  let select: SelectType
  const selectQuery = query
  // apply regular expression and extract values
  const validationRegex = /^(?:[^\[\],]+|\w+\[[^\[\],]+(?:,[^\[\],]+)*\])(,([^\[\],]+|\w+\[[^\[\],]+(?:,[^\[\],]+)*\]))*$/;
  const parsingRegex = /([^\[\],]+)(?:\[([^\[\],]*(?:,[^\[\],]+)*)\])?/g;

  if (validationRegex.test(selectQuery)) {
    // initial select shape
    select = {}
    
    let matches;
    let selectItemsWithoutBrackets = [];
    let selectItemsWithBrackets = [];

    // extract values
    while ((matches = parsingRegex.exec(selectQuery)) !== null) {
      const mainSelectItem = matches[1]
      const subSelectItem = matches[2]
      if (subSelectItem) {
        selectItemsWithBrackets.push({
              main: mainSelectItem,
              sub: subSelectItem.split(',')
          });
      } else {
        selectItemsWithoutBrackets.push(mainSelectItem);
      }
    }

    // build filter object if there is select items without brackets
    selectItemsWithoutBrackets?.forEach(selectItem => {
      // throw error if select field is password
      if (selectItem === 'password') {
            throw new Error('you cannot use password field')
          }

      // throw error if select field is user
      if (selectItem === 'user') {
            throw new Error('you cannot use user field')
          }

      // build filter object
      select = {
        ...select,
        [selectItem]: true
      }
  });

  // build filter object if there is select items with brackets
  selectItemsWithBrackets?.forEach(selectItem => {
    // initial sub select object shape
    let subSelect: SubSelectObject = {
      select: {}
    }
      // throw error if select field is password
      if (selectItem.main === 'password') {
            throw new Error('you cannot use password field')
          }

      // throw error if select field is user
      if (selectItem.main === 'user') {
            throw new Error('you cannot use user field')
          }

          // build sub select filter object
          selectItem.sub.forEach(subItem => {
            // throw error if select field is password
            if (subItem === 'password') {
              throw new Error('you cannot use password field')
            }

            // throw error if select field is user
            if (subItem === 'user') {
              throw new Error('you cannot use user field')
            }

            if (!subSelect.select[subItem]) {
              subSelect.select[subItem] = {}
            }
            subSelect.select[subItem] = true;
          })

      // build filter object
      select = {
        ...select,
        [selectItem.main]: subSelect
      } as SelectType
  });
  } else {
    // invalid format error
    return {
      select: null,
      error: 'invalid select format, valid select example: id or separated with (,) for multiple fields: id,name,email or you can use nested select: id,name,article[comments]',
      status: 400
    }
  }

  return {
    select,
    error: null,
    status: null
  }
}
// searching
export const searching = async (query: string) => {
  // let searchObject = undefined
  let searchObject: SearchObject
  const searchQuery = query
  // apply regular expression
  const regex = /^searchField\[([^\],]*(?:,[^\],]+)*)\],keyword\[([^\]]*)\]$/;
  if (regex.test(searchQuery)) {
    // initial search shape
    searchObject = {
      OR: []
    }

    // extract values from search query
    const match = searchQuery.match(regex)
    const searchFields = match ? match[1] : null;
    const keyword = match ? match[2] : null;

    const searchFieldsItems = searchFields?.split(",")
    searchFieldsItems?.forEach(searchFieldItem => {
      // throw error if search field is password
      if (searchFieldItem === 'password') {
        throw new Error('you cannot use password field')
      }

      // check if searchFieldItem is already exists and skip it if it exist
      if (searchObject.OR.length) {
          const isSearchFieldItemExists = searchObject.OR.some(item => item[searchFieldItem] !== undefined)
          if (isSearchFieldItemExists) return
        }

      // build search object
      searchObject.OR.push({[searchFieldItem]: {contains: keyword || '', mode: "insensitive"}})
    });
  } else {
    // invalid format error
    return {
      searchObject: null,
      error: 'invalid search format, valid search example: searchField[title],keyword[zezo] or separated with (,) for multiple fields: searchField[title,description],keyword[zezo]',
      status: 400
    }
  }

  return {
    searchObject,
    error: null,
    status: null
  }
}