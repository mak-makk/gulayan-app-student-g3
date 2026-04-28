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
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Add New Plant Record</h2>
          <button 
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Plant Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plant Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 
                  focus:ring-green-500 focus:border-transparent outline-none"
                placeholder="Enter plant name"
              />
            </div>

            {/* Variety */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Variety
              </label>
              <select
                name="variety"
                value={formData.variety}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 
                  focus:ring-green-500 focus:border-transparent outline-none"
              >
                <option value="">Select variety</option>
                {plantVarieties.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>

            {/* Batch Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Batch Name
              </label>
              <input
                type="text"
                name="batch_name"
                value={formData.batch_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 
                  focus:ring-green-500 focus:border-transparent outline-none"
                placeholder="Enter batch name"
              />
            </div>

            {/* Seedling Source */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seedling Source
              </label>
              <input
                type="text"
                name="seedling_source"
                value={formData.seedling_source}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 
                  focus:ring-green-500 focus:border-transparent outline-none"
                placeholder="Enter seedling source"
              />
            </div>

            {/* Seedling Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seedling Count
              </label>
              <input
                type="number"
                name="seedling_count"
                value={formData.seedling_count}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 
                  focus:ring-green-500 focus:border-transparent outline-none"
                placeholder="Enter seedling count"
              />
            </div>

            {/* Starting Fund */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Starting Fund
              </label>
              <InputPriceField
                name="starting_fund"
                value={formData.starting_fund}
                onChange={handleChange}
              />
            </div>

            {/* Date Planted */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Planted
              </label>
              <input
                type="date"
                name="date_planted"
                value={formData.date_planted}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 
                  focus:ring-green-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 
                  focus:ring-green-500 focus:border-transparent outline-none"
                placeholder="Enter any additional notes"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 
                hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg 
                hover:bg-green-700 transition-colors cursor-pointer"
            >
              Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModalNewRecord
