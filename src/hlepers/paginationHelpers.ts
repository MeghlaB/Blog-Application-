type IOptions ={
    page?:number| string,
    limit?:number| string,
    sortOder?:string,
    sortBy?:string
}
type IOptionsResult = {
    page:number
    limit:number
    skip:number
    sortOder:string
    sortBy:string
}


const paginationHelpers=(options:IOptions):IOptionsResult=>{
    const page:number = Number(options.page) || 1
    const limit:number=Number(options.limit)||10
      const skip = (page-1)*limit
      const sortBy:string = options.sortBy || "createdAt"
      const sortOder:string = options.sortOder || "desc"
    return {
        page,
        limit,
        skip,
        sortBy,
        sortOder
    }

}
export default paginationHelpers;