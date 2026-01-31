import Modal from "@/components/common/ContentModal";

export default function AddTerms({showModal, setShowModal}:{
  showModal:boolean
  setShowModal:(value:boolean)=>void
}){

  return(
    <div>
       <Modal
        onClose={()=>setShowModal(false)}
        isOpen={showModal}
        title="Add Terms"
      >
        <h4>Welcome To Terms</h4>
      </Modal>
    </div>
  )
}