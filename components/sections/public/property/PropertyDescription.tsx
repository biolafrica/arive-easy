export default function PropertyDescription({description}:any){
  return (
    <div className="rounded-xl border border-border p-5">
      <h3 className="mb-4 font-semibold text-heading">
        Description
      </h3>

      <h4 className="text-sm">
        {description}
      </h4>
    </div>
  )
}