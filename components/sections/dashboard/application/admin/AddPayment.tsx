import Modal from "@/components/common/ContentModal";

export default function AddPayment({showModal, setShowModal}:{
  showModal:boolean
  setShowModal:(value:boolean)=>void
}){

  return(
    <div>
      <Modal
        onClose={()=>setShowModal(false)}
        isOpen={showModal}
        title="Add Payment"
      >
        <h4>Welcome To Payment</h4>
      </Modal>
    </div>
  )
}