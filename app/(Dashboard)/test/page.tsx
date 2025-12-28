import { generateApplicationRefNo } from "@/utils/common/generateApplicationRef";

export default function Test(){
 const reference = generateApplicationRefNo();
  console.log("year", reference)
 
  return(
    <div>
      <h4>Test page</h4>
    </div>
  )
}