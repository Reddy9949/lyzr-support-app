const Home = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Welcome to Lyzr Support
          </h1>
          <p className="mt-3 text-xl text-gray-500 sm:mt-4">
            Get help and support for all your Lyzr needs
          </p>
        </div>
        
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900">Documentation</h3>
              <p className="mt-2 text-sm text-gray-500">
                Browse our comprehensive documentation and guides.
              </p>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900">Support Chat</h3>
              <p className="mt-2 text-sm text-gray-500">
                Get real-time help from our support team.
              </p>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900">Community</h3>
              <p className="mt-2 text-sm text-gray-500">
                Connect with other users and developers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home 