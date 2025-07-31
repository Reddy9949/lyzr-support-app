const Support = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Support Center
          </h1>
          <p className="mt-3 text-xl text-gray-500 sm:mt-4">
            How can we help you today?
          </p>
        </div>
        
        <div className="mt-12">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Contact Support
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get in touch with our support team for personalized help.
                  </p>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900">Email Support</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      support@lyzr.com
                    </p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900">Live Chat</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Available 24/7
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Support 