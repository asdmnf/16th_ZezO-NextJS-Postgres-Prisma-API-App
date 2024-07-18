import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client/extension"
import { User } from "@prisma/client"
import { Role } from "./typescript/enums"
import { fieldSelecting, filtering, pagination, searching, sorting } from "./apiFeatures"
import { BodyType, IncludeObject, PaginationObject, SelectObject } from "./typescript/types"


// get all records handler
export const getAllRecords = async (request: NextRequest, prismaModel: PrismaClient, include?: IncludeObject, select?: SelectObject) => {
  // api features pagination - sorting - filtering - fields selecting - searching
  const {searchParams} = request.nextUrl

  // pagination
  let { skip, limit, paginationObject } = await pagination(searchParams, prismaModel)

    // sorting
    let orderBy = undefined
    const sortQuery = searchParams.get('sort')
    if (sortQuery) {
      const { sort, error, status } = await sorting(sortQuery)
      if (error) {
        return NextResponse.json({
          message: error
        }, {
          status
        })
      }
      orderBy = sort
    }

    // filteration
    let filter = undefined
    const filterQuery = searchParams.get('filter')
    if (filterQuery) {
      const { filterObject, error, status } = await filtering(filterQuery)
      if (error) {
        return NextResponse.json({
          message: error
        }, {
          status
        })
      }
      filter = filterObject
    }

    // fields selecting
    let userSelect = undefined
    const selectQuery = searchParams?.get('select')
    if (selectQuery) {
      const { select, error, status } = await fieldSelecting(selectQuery)
      if (error) {
        return NextResponse.json({
          message: error
        }, {
          status
        })
      }
      userSelect = select
    }

    // searching
    let search = undefined
    const searchQuery = searchParams.get('search')
    if (searchQuery) {
      const { searchObject, error, status } = await searching(searchQuery)
      if (error) {
        return NextResponse.json({
          message: error
        }, {
          status
        })
      }
      search = searchObject
    }

  // get all records
  const records = await prismaModel.findMany({
    skip,
    take: limit,
    orderBy,
    where: {
      ...filter,
      ...search
    },
    select: userSelect ? userSelect : select
  })

  // reset pagination object if there is no records
  if (!records.length) {
    paginationObject = {}  as PaginationObject
  }

  // return response
  return NextResponse.json({
    data: records,
    ...paginationObject
  }, {
    status: 200
  })
}

// get one record handler
export const getOneRecord = async (prismaModel: PrismaClient, id: string, include?: IncludeObject, select?: SelectObject, searchParams?: URLSearchParams) => {
  // fields selecting
  let userSelect = undefined
  const selectQuery = searchParams?.get('select')
  if (selectQuery) {
    const { select, error, status } = await fieldSelecting(selectQuery)
    if (error) {
      return NextResponse.json({
        message: error
      }, {
        status
      })
    }
    userSelect = select
  }

  // get one record
    const record = await prismaModel.findUniqueOrThrow({
      where: {
        id: parseInt(id)
      },
      include: userSelect ? undefined : include,
      select: userSelect ? userSelect : select
    })

    return NextResponse.json(record, {
      status: 200
    })
}

// update record handler
export const updateRecord = async (body: BodyType, prismaModel: PrismaClient, recordID: string, userID?: number, include?: IncludeObject, select?: SelectObject, searchParams?: URLSearchParams) => {
  // fields selecting
  let userSelect = undefined
  const selectQuery = searchParams?.get('select')
  if (selectQuery) {
    const { select, error, status } = await fieldSelecting(selectQuery)
    if (error) {
      return NextResponse.json({
        message: error
      }, {
        status
      })
    }
    userSelect = select
  }

    // get record
    const record = await prismaModel.findUniqueOrThrow({
      where: {
        id: parseInt(recordID)
      }
    }) 

    // check if user own this record
    if (userID && (userID !== record.userId)) {
      return NextResponse.json({
        message: 'forbidden, you can only update your own record'
      }, {
        status: 403
      })
    }

    // update record
    const updatedRecord = await prismaModel.update({
      where: {
        id: parseInt(recordID)
      },
      data: body,
      include: userSelect ? undefined : include,
      select: userSelect ? userSelect : select
    })

    // return response
    return NextResponse.json(updatedRecord, {
      status: 200
    })
}

// delete record handler
export const deleteRecord = async (prismaModel: PrismaClient, recordID: string, user?: User, include?: IncludeObject, select?: SelectObject, searchParams?: URLSearchParams) => {
  // fields selecting
  let userSelect = undefined
  const selectQuery = searchParams?.get('select')
  if (selectQuery) {
    const { select, error, status } = await fieldSelecting(selectQuery)
    if (error) {
      return NextResponse.json({
        message: error
      }, {
        status
      })
    }
    userSelect = select
  }

    // get record
    const record = await prismaModel.findUniqueOrThrow({
      where: {
        id: parseInt(recordID)
      }
    }) 

    // check if user own this record and bypass this restrict for admin
    if (user && (user.role !== Role.ADMIN) && (user.id !== record.userId)) {
      return NextResponse.json({
        message: 'forbidden, you can only delete your own record'
      }, {
        status: 403
      })
    }

    // delete record
    const deletedRecord = await prismaModel.delete({
      where: {
        id: parseInt(recordID)
      },
      include: userSelect ? undefined : include,
      select: userSelect ? userSelect : select
    })

    // return response
    return NextResponse.json(deletedRecord, {
      status: 201
    })
}