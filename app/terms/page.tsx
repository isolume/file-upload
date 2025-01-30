export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 flex flex-col items-center justify-center p-4">
      <div className="bg-white bg-opacity-10 p-8 rounded-lg backdrop-blur-sm max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-white mb-6">Terms</h1>
        <div className="text-white space-y-4">
          <h3 className="text-xl font-bold text-white mb-6">
            What files are allowed?
          </h3>
          <p>
            Any file is allowed, as long as it is not illegal in the United
            States of America, and you have the legal right to distribute it.
            <br className="mb-2" />
            One exception to this rule is that we do not allow any malware,
            viruses, or other harmful software.
          </p>
          <h3 className="text-xl font-bold text-white mb-6">
            What logs are kept?
          </h3>
          <p>
            A database of all files uploaded to the service is kept. This
            includes a randomized file name, a hash of the file, and the time of
            upload. All of this information is deleted at the time the file is
            deleted, which is specified by the user during the upload process.
            <br className="mb-2" />
            Visits to the site are not logged, nor are downloads, or any other
            actions besides uploading.
          </p>
          <h3 className="text-xl font-bold text-white mb-6">
            How can copyrighted material be removed?
          </h3>
          <p>
            If you have copyrighted material that has been uploaded to the
            service, please contact{" "}
            <a
              href="mailto:abuse@umi.to"
              className="underline hover:text-blue-200 transition-colors"
            >
              abuse@umi.to
            </a>{" "}
            and it will be removed as soon as possible.
          </p>
          <h3 className="text-xl font-bold text-white mb-6">
            How can material that infringes on my non-copyright rights be
            removed?
          </h3>
          <p>
            Please contact{" "}
            <a
              href="mailto:abuse@umi.to"
              className="underline hover:text-blue-200 transition-colors"
            >
              abuse@umi.to
            </a>{" "}
            along with an accompanying United States court order.
          </p>
          <h3 className="text-xl font-bold text-white mb-6">
            How can other illegal material be removed?
          </h3>
          <p>
            Please contact the appropriate law enforcement agency if you notice
            any illegal material on the site. This site does incorporate
            automated systems to detect illegal material, but it is not perfect.
            <br className="mb-2" />
            If you are a member of a law enforcement agency, please contact{" "}
            <a
              href="mailto:abuse@umi.to"
              className="underline hover:text-blue-200 transition-colors"
            >
              abuse@umi.to
            </a>
            . While we do not have a legal obligation to remove material that is
            not illegal in the United States of America, we will do our best to
            cooperate with law enforcement.
          </p>
          <h3 className="text-xl font-bold text-white mb-6">
            How old should users of this service be?
          </h3>
          <p>Users must be at least 18 years old to use this service.</p>
        </div>
      </div>
    </div>
  )
}
