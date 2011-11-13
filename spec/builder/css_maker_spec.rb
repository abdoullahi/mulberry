require File.join(File.expand_path(File.dirname(__FILE__)), '../../lib/builder')

describe Builder::CSSMaker do
  before :each do
    @settings = {
      :theme_dir => 'spec/fixtures/css/theme',
    }

    module TouraAPP
      class Directories
        def self.fixtures
          File.join(File.expand_path(File.dirname(__FILE__)), '..', 'fixtures', 'css')
        end

        def self.javascript
          File.join(self.fixtures, 'javascript')
        end
      end
    end
  end

#  it "should raise an error if no vars are provided" do
#    @settings[:vars] = nil
#    lambda {
#      Builder::CSSMaker.new(@settings)
#    }.should raise_error
#  end

  it "should raise an error if no theme path is provided" do
    @settings.delete(:theme_dir)
    lambda {
      Builder::CSSMaker.new(@settings)
    }.should raise_error
  end

  it "should throw an error if there is no file at the provided custom base path" do
    @settings[:theme_dir] = 'fake'

    lambda {
      Builder::CSSMaker.new(@settings)
    }.should raise_error
  end

  it "should properly render the css" do
    css = Builder::CSSMaker.new(@settings).render

    # test that the toura css was loaded
    css.should match '#toura'

    # test that the custom css was loaded
    css.should match '#custom'

    # test that the custom file "wins"
    css.should match '#000003'

    #test that we loaded files from the provided load paths
    css.should match '#imported'
  end
end
