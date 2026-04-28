import { useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import InputPriceField from '../../components/InputPriceField'

function ModalNewRecord({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    variety: '',
    notes: '',
    date_planted: '',
    seedling_count: '',
    batch_name: '',
    starting_fund: '',
    seedling_source: ''
  })
  const plantVarieties = [
    "Vegetables",
    "Leafy Greens",
    "Root Crops",
    "Herbs",
    "Fruits",
    "Legumes",
    "Spices",
    "Mushrooms",
    "Ornamentals",
    "Medicinal Plants",
    "Vines",
    "Fruit Trees",
    "Other",
    "Unknown",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData);
    setFormData({
      name: '',
      variety: '',
      notes: '',
      date_planted: '',
      seedling_count: '',
      batch_name: '',
      starting_fund: '',
      seedling_source: ''
    });
  }

  const handleClose = () => {
    // Reset form when closing
    setFormData({
      name: '',
      variety: '',
      notes: '',
      date_planted: '',
      quantity: '',
      batch_name: '',
      starting_fund: '',
      seedling_source: ''
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Add New Record</h3>
            <button onClick={handleClose} className="text-gray-600 hover:text-gray-800">
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-2 gap-4">
              <input name="name" value={formData.name} onChange={handleChange} placeholder="Plant name" className="w-full px-4 py-2 border rounded" />
              <select name="variety" value={formData.variety} onChange={handleChange} className="w-full px-4 py-2 border rounded">
                <option value="">Select variety</option>
                {plantVarieties.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input name="batch_name" value={formData.batch_name} onChange={handleChange} placeholder="Batch name" className="w-full px-4 py-2 border rounded" />
              <input name="seedling_source" value={formData.seedling_source} onChange={handleChange} placeholder="Seedling source" className="w-full px-4 py-2 border rounded" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <input name="seedling_count" value={formData.seedling_count} onChange={handleChange} placeholder="Seedling count" type="number" className="w-full px-4 py-2 border rounded" />
              <InputPriceField formData={formData} setFormData={setFormData} name="starting_fund" placeholder="Starting fund" />
              <input name="date_planted" value={formData.date_planted} onChange={handleChange} type="date" className="w-full px-4 py-2 border rounded" />
            </div>

            <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Notes" className="w-full px-4 py-2 border rounded" />

            <div className="flex justify-end gap-2 mt-2">
              <button type="button" onClick={handleClose} className="px-4 py-2 bg-gray-100 rounded">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ModalNewRecord
